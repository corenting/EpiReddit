'use strict';
module.exports = (sequelize, DataTypes) => {
  var CommentVote = sequelize.define('CommentVote', {
    score: DataTypes.INTEGER
  }, {});
  CommentVote.associate = function(models) {
    models.CommentVote.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    models.CommentVote.belongsTo(models.Comment, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  return CommentVote;
};