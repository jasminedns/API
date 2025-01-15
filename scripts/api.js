$( () => { 

    let allGames = [];


    const API_ENDPOINT = "https://api.rawg.io/api/games?";
    const apiKey = "f64cb459141649f18772e0841a1ca355";

    const getGames = async () => { 

        for (let page = 1; page <= 10; page++) { 
            let response = await fetch(`${API_ENDPOINT}key=${apiKey}&page=${page}`); 
            let data = await response.json();
            
            let games = data.results;
            allGames = allGames.concat(games);

            allGames.sort((a, b) => b.rating - a.rating);

            let top5Games = allGames.slice(0, 5);

            $(".search__results").empty();

            top5Games.forEach(game => {
                $(".search__results").append(`<img class="game__pic--img" src="${game.background_image}"> <p class="game__pic--text">${game.name}<br>Rating: ${game.rating}<br></p>`)
            });
        } 
    }

    $(".search-top5__window").on("click", () => {
        
        getGames();
    });

});