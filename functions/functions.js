
module.exports ={
    DateParser: () =>{
        let today = new Date();
        let monthAgo = new Date(today.getTime() - 2592000000)
        return {today: today.toISOString().slice(0,10), monthAgo: monthAgo.toISOString().slice(0,10)};
    },


    storeToDB: () =>{
        console.log("moi")
    }
}
