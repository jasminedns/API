$( () => { 

    const searchAllGames = $(".search__allgames");
    const searchResults = $(".search__results");
    const searchSaved = $(".search__saved");

    const API_ENDPOINT = "https://api.rawg.io/api/games?";
    const apiKey = "efc1b0763920484098f874d0ae1f2829";

    const fetchGames = async (search) => {
        let response = await fetch(`${API_ENDPOINT}key=${apiKey}${search}`);
        let data = await response.json();
        const games = data.results;
        return games;
    }

    const saveGame = (game) => {
        localStorage.setItem("savedGame", JSON.stringify(game));
        updateSavedWindow();
    }
    
    function updateSavedWindow() {
        const savedWindow = document.querySelector(".search-saved__window");
        const savedGame = JSON.parse(localStorage.getItem("savedGame"));
    
        if (savedGame) {
            savedWindow.innerHTML = `<p class="search-saved__title">${savedGame.name}</p>`;
            savedWindow.style.backgroundImage = `url(${savedGame.background_image})`;
        } else {
            savedWindow.innerHTML = "<p>No game saved</p>";
        }
    }

    const searchGame = async (search) => {
        const games = await fetchGames(`&search=${search}`);
        searchAllGames.show();
        searchAllGames.empty();
        searchResults.hide();
        searchSaved.hide();

        for (let i = 0; i < games.length; i++) { 
            const gameItem = $(
                    `<div class="game__pic--container">
                        <img class="game__pic--img" src="${games[i].background_image}">
                        <p class="game__pic--text">${games[i].name}<br></p>
                        <button class="game__pic--save">Save</button>
                    </div>`
            );

            searchAllGames.append(gameItem);

            gameItem.find(".game__pic--save").on("click", () => {
                saveGame(games[i]);
            })
            
        }
    }

    const top10 = async () => {
        const games = await fetchGames("&metacritic=97,100");

        searchAllGames.hide();
        searchSaved.hide();
        searchResults.show();
        searchResults.empty();

        for (let i = 0; i < games.length; i++) { 
            games.sort((a, b) => b.metacritic - a.metacritic);

            if (games[i].background_image === null) {
                searchResults.append(
                    `<div class="game__pic--container">
                        <img class="game__pic--img" src="./images/soulcalibur-game-cover-.jpg">
                        <p class="game__pic--text">${games[i].name}<br>Metacritic: ${games[i].metacritic}<br></p>
                        <button class="game__pic--save">Save</button>
                    </div>`
                )
            } else {
                const gameItem = $(
                    `<div class="game__pic--container">
                        <img class="game__pic--img" src="${games[i].background_image}">
                        <p class="game__pic--text">${games[i].name}<br>Metacritic: ${games[i].metacritic}<br></p>
                        <button class="game__pic--save">Save</button>
                    </div>`
                );

                searchResults.append(gameItem);

                gameItem.find(".game__pic--save").on("click", () => {
                    saveGame(games[i]);
                })
            }
        }
    }

    const newGames = async () => {
        const games = await fetchGames("&ordering=-released&dates=2025-01-01,2025-02-01");
        searchAllGames.hide();
        searchSaved.hide();
        searchResults.show();
        searchResults.empty();

        for (let i = 0; i < games.length; i++) { 
            const gameItem = $(
                    `<div class="game__pic--container">
                        <img class="game__pic--img" src="${games[i].background_image}">
                        <p class="game__pic--text">${games[i].name}<br>Released: ${games[i].released}<br></p>
                        <button class="game__pic--save">Save</button>
                    </div>`
            );

            searchResults.append(gameItem);

            gameItem.find(".game__pic--save").on("click", () => {
                saveGame(games[i]);
            })
        }    
    }

    $(".searchbar-button").on("click", () => {
        const search = $(".searchbar").val();
        searchGame(search);
    })

    $(".search-top10__window").on("click", () => {
        top10();
    })

    $(".search-newreleases__window").on("click", () => {
        newGames();
    })

    $(".search-saved__window").on("click", () => {
        updateSavedWindow();
    })

});