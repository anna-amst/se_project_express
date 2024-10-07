const ClothingItem = require("../models/clothingItem");

const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError("Invalid data entered"));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid data entered"));
      }
      return next(error);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      const ownerId = item.owner.toString();

      if (userId !== ownerId) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }

      return ClothingItem.findByIdAndDelete(itemId)
        .then(() => res.send({ message: "Item successfully deleted" }))
        .catch((err) => {
          console.error(`Error ${err.name} with message ${err.message}`);

          if (err.name === "CastError") {
            next(new BadRequestError("Invalid data entered"));
          }

          return next(err);
        });
    })
    .catch((err) => {
      console.error(`Error ${err.name} with message ${err.message}`);

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Document not found"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data entered"));
      }

      return next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(`Error ${err.name} with message ${err.message}`);

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Document not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data entered"));
      }

      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(`Error ${err.name} with message ${err.message}`);

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Document not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data entered"));
      }

      return next(err);
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
