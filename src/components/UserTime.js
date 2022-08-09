import React, { useState, useEffect } from 'react';

const UserTime = () => {
    const [timestamp, setTimestamp] = useState();
    const [meal, setMeal] = useState({ type: "", parameters: "" });

    const timestampChange = (event) => {
        setTimestamp(event);
    }

    const mealChange = (event) => {
        setMeal(event);
    };


    useEffect(() => {
        window.navigator.geolocation.getCurrentPosition(
            position => timestampChange(position.timestamp),
            (err) => console.log(err)
        );
    }), [];

    const date = new Date(timestamp);
    const time = date.getHours();
    console.log(time);

    if (time >= 3 && time < 11) {
        mealChange({
            type: "Breakfast Recipes",
            parameters: "breakfast, beverage"
        });
    } else if (time >= 11 && time < 15) {
        mealChange({
            type: "Lunch Recipes",
            parameters: "salad, snack, bread, appetizer, drink, soup, beverage"
        });
    } else if (time >= 15 && time < 23) {
        mealChange({
            type: "Dinner Recipes",
            parameters: "main course, side dish, dessert, marinade, appetizer, soup, drink, beverage, sauce"
        });
    } else {
        mealChange({
            type: "Snacks",
            parameters: "fingerfood, drink, beverage"
        });
    }

    return (
        <div>{meal.type}</div>
    );
};

export default UserTime;