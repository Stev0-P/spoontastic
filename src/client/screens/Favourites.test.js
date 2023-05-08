import React from "react";
import axios from "axios";
import Favourites from "./favourites";
import UserContext from "../context/User";
import ReactDOM from "react-dom";

jest.mock("axios");

const mockUser = {
  userId: "6429903461a5315f99330597",
  favourites: null,
};

const mockRecipes = {
  recipe: [
    {
      id: "662649",
      title: "Recipe 1",
      image: "http://example.com/image1.jpg",
    },
    {
      id: "730914",
      title: "Recipe 2",
      image: "http://example.com/image2.jpg",
    },
  ],
};

describe("Favourites", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders properly and fetches necessary data", async () => {
    axios.get.mockResolvedValueOnce({ data: mockRecipes });

    ReactDOM.render(
      <UserContext.Provider value={mockUser}>
        <Favourites />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`/api/favourites/${mockUser.userId}`);
    });
  });
});
