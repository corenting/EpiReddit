'use strict';
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('Comment', {
    content: DataTypes.STRING
  }, {});
  Comment.associate = function(models) {
    models.Comment.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    models.Comment.belongsTo(models.Post, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    models.Comment.belongsTo(models.Comment, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: true,
        name: 'ParentId',
      }
    });

    models.Comment.hasMany(models.CommentVote);
  };
  return Comment;
};