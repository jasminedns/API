$( () => { 

    let allGames = [];


    const API_ENDPOINT = "https://api.rawg.io/api/games?";
    const apiKey = "f64cb459141649f18772e0841a1ca355";

    const getGames = async () => { 
        allGames.length = 0;
        games = 0;

        for (let page = 1; page <= 20; page++) { 

            let response = await fetch(`${API_ENDPOINT}key=${apiKey}&page=${page}`); 
            let data = await response.json();
            let games = data.results;
            allGames = allGames.concat(games);

        } 
        console.log(allGames)
    }

    const top5 = async () => {
        await getGames();

        allGames.sort((a, b) => b.rating - a.rating);
        let top5Games = allGames.slice(0, 5);

        $(".search__results").empty();

        top5Games.forEach(game => {
            $(".search__results").append(`<img class="game__pic--img" src="${game.background_image}"> <p class="game__pic--text">${game.name}<br>Rating: ${game.rating}<br></p>`)
        });
    }

    const newGames = async () => {
        await getGames();

        allGames.sort((a, b) => new Date(b.released) - new Date(a.released));
        let newestGames = allGames.slice(0,5);

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

});