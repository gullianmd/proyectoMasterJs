import React, {Component} from 'react';
import { Button, TextField, Paper, NativeSelect, InputLabel} from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import pokeBall from './../../assets/pokeBall.png';
import './styles.css';

class Pokedex extends Component{

    constructor(props){
        super(props)

        this.state = {
            textInputData : "",
            apiData : [],
            numberOfPokemon: "Sin Datos",
            pokemonStats : {},
            pokemonAvatar : pokeBall,
            firstFiveMoves : "---",
            placetoFind: "---",
            moveSearchResult : [],
            menuList: [],
            listSelection : "",
            progressBar : 0
        }
    }

    getApiData = async () => {
        const fetchData = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1118', {method : 'GET'})
        const parsedData = await fetchData.json()
        this.setState({apiData : parsedData.results})
        this.startfakeProgressBar()
    }

    getNumberOfPokemon = () => {
        const {apiData} = this.state
        const stringnumber = apiData.length.toString()
        this.setState({numberOfPokemon: stringnumber})
    }

    startfakeProgressBar = () => {

        const fakeProgressBar = setInterval(() => {

            const {progressBar} = this.state
    
            if (progressBar < 100){
                const acumulador = progressBar + 10
                this.setState({progressBar: acumulador})
            } else if (progressBar === 100) {
                this.setPokemonMenuList()
                this.getNumberOfPokemon()
                clearInterval(fakeProgressBar)
            }
    
        }, 250);
    }

    getPokemon = async () => {
        const {apiData, textInputData} = this.state
        if (apiData.length === 0) {
            alert('Recupera datos')
        } else if (apiData.find(element => element.name === textInputData) === undefined) {
            alert('El nombre que escribiste no está en esta lista')
        } else {
            const [{url}] = apiData.filter(element => element.name === textInputData)
            const data = await fetch(url, {method: 'GET'})
            const {id, height, moves, name, sprites : {front_default}, weight, types, location_area_encounters} = await data.json()
            this.setState({
                pokemonStats: {id, height, moves, pokeName : name, weight, types, placesToFindUrl: location_area_encounters}, 
                pokemonAvatar: front_default,
                listSelection : ""
            })
            this.FivePokeMoves()
            this.placeToFindPokemon()
        }
    }
    
    setPokemonMenuList = () => {
        const {apiData} = this.state
        const nameList = apiData.map(element => element.name).sort()
        const readyList = nameList.map((element, index) => {return <option key={index} value={element}>{element}</option>})
        this.setState({menuList: readyList})
    }

    FivePokeMoves = () => {
        const {pokemonStats:{moves}} = this.state
        const firstArray = moves.slice(0,5).map(element => element.move.name)
        if (firstArray.length === 0) {
            this.setState({firstFiveMoves: "Sin Movimientos"})
        } else {
            const fiveMoves = firstArray.reduce((accumulator, currentvalue) => accumulator+" - "+currentvalue)
            this.setState({firstFiveMoves: fiveMoves})
        }    
    }

    placeToFindPokemon = async () => {
        const {pokemonStats : {placesToFindUrl}} = this.state
        const fetchPlaces = await fetch(placesToFindUrl)
        const parsedPlaces = await fetchPlaces.json()
        if (parsedPlaces.find(element => element['location_area']['name']) === undefined) {
            this.setState({placetoFind: "No encontrado"})
        } else {
            const {location_area: {name}} = parsedPlaces.find(element => element['location_area']['name'])
            this.setState({placetoFind: name})
        }
    }  

    textInputChangue = (value) => {
        this.setState({textInputData : value, listSelection: value })
    }
    
    saveFavorite = () => {
        const {
            pokemonAvatar,
            pokemonStats,
            firstFiveMoves,
            placetoFind,
        } = this.state

        const saveList = [
            pokemonAvatar,
            JSON.stringify(pokemonStats),
            firstFiveMoves,
            placetoFind,
        ]

        if (pokemonAvatar === "---" || pokemonStats.length === 0 || firstFiveMoves === "---" || placetoFind === "---") {
            alert('Los datos del pokemón no están cargados. Selecciona un pokemon de la lista (o escríbelo) y luego apreta el botón "Buscar" pokemón para cargar la información')
        } else {
            saveList.forEach(
                (element, index) => {localStorage.setItem(index, element)}
            )
            alert('Pokemón guardado en LocalStorage')
        }
    }

    render(){
        const {
            pokemonAvatar,
            pokemonStats: {
                id = "---",
                height = "---",
                pokeName = "---",
                weight = "---"
            },
            menuList,
            listSelection,
            firstFiveMoves,
            numberOfPokemon,
            placetoFind,
            progressBar
        } = this.state
        
        return(
            <>
            <LinearProgress  id="fakeBar" className="progressBar" variant="determinate" value={progressBar}/>
        
            <div className="fetchSection">
                
        
                <Button variant="contained" onClick={this.getApiData}>
                    Recuperar Datos
                </Button>
        
                <div>
                    <InputLabel htmlFor="select">Pokemones encontrados ({numberOfPokemon})</InputLabel>
                    <NativeSelect className="list" value={listSelection} onChange={(event) => this.textInputChangue(event.target.value)}>
                        <option key="default" value="" disabled>Lista</option>
                        {menuList}
                    </NativeSelect>
                </div>
        
            </div>
        
            <Paper className="paperColor" elevation={3}>
                <div className="searchSection">
                    <div className="searchColumn">
                        <div className="columnPadding">
                            <h3>Buscador</h3>
                            <TextField 
                                className="buttonPadding" 
                                variant="outlined" 
                                size="small"
                                value={listSelection}
                                onChange={(event) => this.textInputChangue(event.target.value) }
                            />
                        </div>
                        <Button onClick={this.getPokemon} variant="contained">Buscar Pokemon</Button>
                    </div>
                    <img alt="Sin imagen" className="image" src={pokemonAvatar}/>
                </div>
            </Paper>
        
            <br/>
            
            <Paper className="paperColor" variant="outlined">
                <div className="dataSection">
                    <h3>Datos básicos del Pokemón</h3>
                    <div>
                        <p>Nombre : {pokeName}</p>
                        <p>ID : {id}</p>
                        <p>Altura : {height} </p>
                        <p>Peso: {weight}</p>
                        <p>Movimientos: {firstFiveMoves}</p>
                        <p>Un lugar donde encontrarlo : {placetoFind}</p>
                    </div>
                </div>
            </Paper>
        
            <br/>
        
            <div className="saveButton">
                <Button variant="contained" size="small" onClick={this.saveFavorite}>
                    Guardar Pokemon Favorito
                </Button>
            </div>
        </>
        )
    }
}

export default Pokedex



