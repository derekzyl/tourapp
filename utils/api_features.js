/** @format */

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryTo = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryTo[el]);
    console.log(queryTo);
    let queryStr = JSON.stringify(queryTo);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  limit() {
    if (this.queryString.limit) {
      this.query = this.query.limit(this.queryString.limit * 1);
    } else {
      this.query = this.query.limit(10);
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;

    const limit = this.queryString.limit * 1 || 100;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
