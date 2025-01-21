$( () => { 

    let allGames = [];


    const API_ENDPOINT = "https://api.rawg.io/api/games?";
    const apiKey = "f64cb459141649f18772e0841a1ca355";

    const getGames = async () => { 
        allGames.length = 0;

        for (let page = 1; page <= 20; page++) { 
            try {
                let response = await fetch(`${API_ENDPOINT}key=${apiKey}&page=${page}`); 
                
                if(!response.ok) {
                    throw new Error(`Error! status of the error: ${response.status}`);
                }
                
                let data = await response.json();
                let games = data.results;
                allGames = allGames.concat(games);
            } catch (error) {
                throw new error(`There must have been an error. Sorry for the inconvinience. Error: ${error}`)
            }
        } 
        console.log(allGames)
    }

    const searchGames = async (query) => {
        await getGames();
        const userGame = allGames.filter(game => game.name && game.name.toLowerCase().includes(query.toLowerCase()))
        $(".search__allgames").show();
        $(".search__results").hide();
        $(".search__allgames").empty();

        if(userGame.length===0) {
            $(".search__allgames").append(`<p>No game found with that name</p>`)
        } else {
            userGame.forEach(game => {
                $(".search__allgames").append(`<img class="game__pic--img" src="${game.background_image}"> <p class="game__pic--text">${game.name}<br>`)
            })
        }
    }

    const top5 = async () => {
        await getGames();

        allGames.sort((a, b) => b.rating - a.rating);
        let top5Games = allGames.slice(0, 5);
        $(".search__allgames").hide();
        $(".search__results").show();
        $(".search__results").empty();
        

        top5Games.forEach(game => {
            $(".search__results").append(`<img class="game__pic--img" src="${game.background_image}"> <p class="game__pic--text">${game.name}<br>Rating: ${game.rating}<br></p>`)
        });
    }

    const newGames = async () => {
        await getGames();

        allGames.sort((a, b) => new Date(b.released) - new Date(a.released));
        let newestGames = allGames.slice(0,5);
        $(".search__allgames").hide();
        $(".search__results").show();
        $(".search__results").empty();

        newestGames.forEach(game => {
            $(".search__results").append(`<img class="game__pic--img" src="${game.background_image}"> <p class="game__pic--text">${game.name}<br>Released: ${game.released}<br></p>`) 
        })
    }


    $(".search-top5__window").on("click", () => {
        $(".search__results--container").toggleClass("hidden")
        top5();
    });

    $(".search-newreleases__window").on("click", () => {
        $(".search__results--container").toggleClass("hidden")
        newGames();
    })

    $(".searchbar-button").on("click", () => {
        const query = $(".searchbar").val();
        $(".search__results--container").toggleClass("hidden")
        searchGames(query);
    })

});