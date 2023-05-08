import favouritesListItemSchema from "../../services/favourites/favourites.model";
import {
  getAllFavouritesByUser,
  getFavouriteByUserAndRecipe,
  getFavouriteByRecipeId,
  addFavourite,
  deleteFavourite,
} from "../controllers/favourites/favourites.controller";

var httpMocks = require("node-mocks-http");
const { mockRequest, mockResponse } = httpMocks;
const { ValidationError } = require("mongoose");

jest.mock("../../services/favourites/favourites.model");

describe("getAllFavouritesByUser", () => {
  it("returns a list of favourite recipes for the user", async () => {
    const userId = "6429903461a5315f99330597";
    const req = mockRequest({ params: { uid: userId } });
    const res = mockResponse();

    const mockRecipes = [
      {
        _id: "1",
        creator: userId,
        title: "Recipe 1",
        toObject: () => ({
          id: "1",
          creator: userId,
          title: "Recipe 1",
        }),
      },
      {
        _id: "2",
        creator: userId,
        title: "Recipe 2",
        toObject: () => ({
          id: "2",
          creator: userId,
          title: "Recipe 2",
        }),
      },
    ];
    favouritesListItemSchema.find.mockResolvedValue(mockRecipes);

    await getAllFavouritesByUser(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      recipe: [
        {
          id: "1",
          creator: userId,
          title: "Recipe 1",
        },
        {
          id: "2",
          creator: userId,
          title: "Recipe 2",
        },
      ],
    });
    expect(favouritesListItemSchema.find).toHaveBeenCalledWith({ creator: userId });
  });

  it("returns an error when the database query fails", async () => {
    const userId = "1";
    const req = mockRequest({ params: { uid: userId } });
    const res = mockResponse();
    const next = jest.fn();

    favouritesListItemSchema.find.mockRejectedValue(new Error("Database error"));

    await getAllFavouritesByUser(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.message).toBe("Something went wrong!");
    expect(error.code).toBe(500);
  });
});
