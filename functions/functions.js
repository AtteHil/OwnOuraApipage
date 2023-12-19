const mongoose = require("mongoose");
module.exports = {
    DateParser: () => {
        let today = new Date();
        let monthAgo = new Date(today.getTime() - 2592000000)
        return { today: today.toISOString().slice(0, 10), monthAgo: monthAgo.toISOString().slice(0, 10) };
    },

    //flexible schema to upload json objects straight from oura api to mongodb
    makeSchema: (title, id) => {
        const FlexibleSchema = new mongoose.Schema({}, { strict: false });
        return mongoose.model(title + id.slice(0, 5), FlexibleSchema);
    },

    // Add data to mongodb
    addToDb: async (database, result) => {
        for (let i = 0; i < result.data.length; i++) {
            database.find({ day: result.data[i].day }) // try to find the data we are trying to save
                .then((data) => {
                    if (!data.length) {// if not found we save it to db if data.length == 0 this is true
                        database.create(result.data[i])
                    }
                })
        }
        return true;
    },

    findFromDB: async (database, startDate, endDate) => { // function to search from data base on selected days and between
        const currentDate = new Date(startDate);
        endDate = new Date(endDate);
        let foundArray = [];

        while (currentDate <= endDate) {

            const formattedDate = currentDate.toISOString().split('T')[0];;


            try {
                const data = await database.find({ day: formattedDate });

                if (data.length) { // if data is found we push it to array
                    foundArray.push(data);
                    console.log("found data for day " + formattedDate);
                }
            } catch (error) {
                console.error("Error while fetching data:", error);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return foundArray;
    }
}
