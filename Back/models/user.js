'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    password_salt: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    models.User.hasMany(models.Post);
  };
  return User;
};