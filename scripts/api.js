$( () => { 

    let allGames = [];
    let allGamesFetched = false;
    const searchAllGames = $(".search__allgames");
    const searchResults = $(".search__results");
    const searchSaved = $(".search__saved");

    const API_ENDPOINT = "https://api.rawg.io/api/games?";
    const apiKey = "f64cb459141649f18772e0841a1ca355";

    const getGames = async () => { 
        if(allGamesFetched) {
            return;
        }

        allGames.length = 0;
        $(".search__results--loading").show();

        for (let page = 1; page <= 50; page++) { 
            try {
                let response = await fetch(`${API_ENDPOINT}key=${apiKey}&page=${page}`); 
                
                if(!response.ok) {
                    throw new Error(`Error! status of the error: ${response.status}`);
                }
                
                let data = await response.json();
                let games = data.results;
                allGames = allGames.concat(games);

            } catch (error) {
                throw new error(`There must have been an error. Sorry for the inconvenience. Error: ${error}`)
            }
        }
        allGamesFetched = true;
        $(".search__results--loading").hide();
    }

    function saveGame(game) {
        localStorage.setItem('savedGame', JSON.stringify(game));
        updateSavedWindow();
    }
    
    function updateSavedWindow() {
        const savedWindow = document.querySelector('.search-saved__window');
        const savedGame = JSON.parse(localStorage.getItem('savedGame'));
    
        if (savedGame) {
            savedWindow.innerHTML = `<p class="search-saved__title">${savedGame.name}</p>`;
            savedWindow.style.backgroundImage = `url(${savedGame.background_image})`;
        } else {
            savedWindow.innerHTML = '<p>No game saved</p>';
        }
    }

    const searchGames = async (query) => {
        await getGames();
        const userGame = allGames.filter(game => game.name && game.name.toLowerCase().includes(query.toLowerCase()))
        searchAllGames.show();
        searchAllGames.empty();

        searchResults.hide();
        searchSaved.hide();

        if(userGame.length===0) {
            searchAllGames.append(`<p>No game found</p>`)

        } else {
            userGame.forEach(game => {
                const gameElement = $(`
                    <div class="game__pic--container">
                        <img class="game__pic--img" src="${game.background_image}">
                        <p class="game__pic--text">${game.name}<br></p>
                        <button class="game__pic--save">Save</button>
                    </div>
                `);
                searchAllGames.append(gameElement);
    
                gameElement.find('.game__pic--save').on('click', () => {
                    saveGame(game);
                });
            });
        }
    }

    const top5 = async () => {
        await getGames();

        allGames.sort((a, b) => b.rating - a.rating);
        let top5Games = allGames.slice(0, 5);

        searchAllGames.hide();
        searchSaved.hide();
        searchResults.show();
        searchResults.empty();
        
        top5Games.forEach(game => {
            const gameElement = $(`
                <div class="game__pic--container">
                    <img class="game__pic--img" src="${game.background_image}">
                    <p class="game__pic--text">${game.name}<br>Released: ${game.rating}<br></p>
                    <button class="game__pic--save">Save</button>
                </div>
            `);
            searchResults.append(gameElement);

            gameElement.find('.game__pic--save').on('click', () => {
                saveGame(game);
            });
        });
    }

    const newGames = async () => {
        await getGames();

        allGames.sort((a, b) => new Date(b.released) - new Date(a.released));
        let newestGames = allGames.slice(0,5);

        searchAllGames.hide();
        searchSaved.hide();
        searchResults.show();
        searchResults.empty();

        newestGames.forEach(game => {
            const gameElement = $(`
                <div class="game__pic--container">
                    <img class="game__pic--img" src="${game.background_image}">
                    <p class="game__pic--text">${game.name}<br>Released: ${game.released}<br></p>
                    <button class="game__pic--save">Save</button>
                </div>
            `);
            searchResults.append(gameElement);

            gameElement.find('.game__pic--save').on('click', () => {
                saveGame(game);
            });
        });
    }

    $(".search-top5__window").on("click", () => {
        top5();
    });

    $(".search-newreleases__window").on("click", () => {
        newGames();
    })

    $(".search-saved__window").on("click", () => {
        updateSavedWindow();
    });

    $(".searchbar-button").on("click", () => {
        const query = $(".searchbar").val();
        searchGames(query);
    })

});