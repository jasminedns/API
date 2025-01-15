$( () => { 

    const API_ENDPOINT = "https://api.rawg.io/api/games?";
    const apiKey = "f64cb459141649f18772e0841a1ca355";

    const getGames = async () => { 
        let bestGames = [];

        for (let page = 1; page <= 10; page++) { 
            let response = await fetch(`${API_ENDPOINT}key=${apiKey}&page=${page}`); 
            let data = await response.json();
            
            let games = data.results;
            best5Games = bestGames.concat(games);

            best5Games.sort((a, b) => b.rating - a.rating);

            best5Games.forEach(game => {
                $(".search__results").append(`${game.name} Rating: ${game.rating} <br>`);
            });
        } 
    } 

    $(".search-top5__window").on("click", () => {
        getGames();
    });

});