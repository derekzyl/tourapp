/** @format */

const Tour = require('../model/tourModel');
const APIFeatures = require('../utils/api_features');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const tours = fs.readFileSync(
//   `${__dirname}/../dev-data/data/tours-simple.json`
// );
// const toursJson = JSON.parse(tours);

// exports.checkBody = (req, res, next) => {
//   const name = req.body.name;
//   const price = req.body.price;
//   if (price || name) {
//     return next();
//   }
//   return res.status(400).json({
//     error: true,
//     message: 'invalid',
//   });
// };

// exports.checkId = (req, res, next, val) => {
//   const ide = req.params.id * 1;
//   //  console.log('this worked')

//   if (ide > toursJson.length) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'invalid id',
//     });
//   }
//   next();
// };
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);

  console.log(tour);
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.GetAll = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    const tours = await features.query;

    // //Execute QUERY
    // const tou = await query;
    // //  console.log('testing');
    // console.log(req.query);

    //RESPONSE
    res.status(200).json({
      status: 'success \u{1F64B}',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'failure',
      error: error,
    });
  }
};

/**
 * Get Some by Id
 * --------------
 *
 * @param {* req.params && req.body },
 * @param {* res}
 */
exports.GetSome = async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleTour = await Tour.findById(id);

    if (!singleTour) {
      return next(new AppError('no tour found  with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: singleTour,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      error: error,
    });
  }
  // console.log(req.params);
  // const id = req.params.id * 1;
  // // const tour = toursJson.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {},
  // });
};

// exports.PostAll = (req, res) => {
//   const body = req.body;
//   console.log(JSON.stringify(body));

//   // const newId = toursJson[toursJson.length - 1].id + 1;
//   // const newTour = Object.assign({ id: newId }, body);

//   // toursJson.push(newTour);
//   // fs.writeFile(
//   //   `${__dirname}/dev-data/data/tours-simple.json`,
//   //   JSON.stringify(toursJson),
//   //   (err) => {
//   //     res.status(201).json({
//   //       status: 'success',
//   //       data: {
//   //         tour: newTour,
//   //       },
//   //     });
//   //   }
//   // );
// };

exports.Patch = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updateOne = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: 'success',
      data: updateOne,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      error: error,
    });
  }
};
exports.Delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndRemove(id);
    res.status(204).json({
      message: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      message: 'success',
      data: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
        },
      },

      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          num: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: {
            $min: '$price',
          },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      //   {
      //   $match:{$ne:'EASY'}
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: 'startDates' },

          numTourStats: { $add: 1 },
          tours: { $push: '$name' },
        },
      },
      { $addfields: { month: '$id' } },
      { $project: { _id: 0 } },
      { $sort: { numTourStats: -1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err,
    });
  }
};
