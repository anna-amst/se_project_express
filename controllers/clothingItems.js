const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl} = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Validation Error", error: error.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Internal Server Error", error: error.message });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
//   .orFail(() => {
//     const error = new Error("Item not found");
//     error.statusCode = NOT_FOUND;
//     throw error;
//   })
//   .then((item) => res.send({ data: item }))
//   .catch((err) => {
//     console.error(`Error ${err.name} with message ${err.message}`);

//     if (err.name === 'ValidationError') {
//       return res.status(BAD_REQUEST).send({ message: "Invalid data provided" });
//     }

//     if (err.name === "DocumentNotFoundError") {
//       return res.status(NOT_FOUND).send({ message: err.message });
//     }

//     res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
//   });
// };

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  
  ClothingItem.findByIdAndDelete(itemId)
  .orFail(() => {
    const error = new Error("Item not found");
    error.statusCode = NOT_FOUND;
    throw error;
  })
  .then(() => res.status(200).send({}))
  .catch((err) => {
    console.error(`Error ${err.name} with message ${err.message}`);

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: err.message });
    }
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({message: "Invalid data"})
    }

    return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
  });
};

const likeItem = (req, res) => {

  ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true }
)
.orFail(() => {
  const error = new Error("Item not found");
  error.statusCode = NOT_FOUND;
  throw error;
})
.then((item) => {
  res.res.status(200).send({ data: item });
})
.catch((err) => {
  console.error(`Error ${err.name} with message ${err.message}`);

  if (err.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND).send({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({message: "Invalid data"})
  }

  return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
});
}

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } },
  { new: true }
)
.orFail(() => {
  const error = new Error("Item not found");
  error.statusCode = NOT_FOUND;
  throw error;
})
.then((item) => {
  res.status(200).send({ data: item });
})
.catch((err) => {
  console.error(`Error ${err.name} with message ${err.message}`);

  if (err.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND).send({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({message: "Invalid data"})
  }

  return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
});

}

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
