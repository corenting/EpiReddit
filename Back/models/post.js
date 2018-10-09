'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    content: DataTypes.STRING,
    title: DataTypes.STRING,
    link: DataTypes.STRING,
    picture: DataTypes.STRING,
    hotness: DataTypes.FLOAT
  }, {});
  Post.associate = function(models) {
    models.Post.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    models.Post.belongsTo(models.Category, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    models.Post.hasMany(models.Vote);
    models.Post.hasMany(models.Comment);
  };
  return Post;
};