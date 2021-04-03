import React, {Component} from 'react';
import {Button, Paper} from '@material-ui/core';
import './styles.css'
import pokeBall from './../../assets/pokeBall.png';

class PokeFav extends Component{

    constructor(props){
        super(props)

        this.state = {
            pokemonAvatar : "",
            pokemonStats : "",
            firstFiveMoves : "",
            placetoFind : ""
        }
    }

    componentDidMount(){
        setTimeout(this.getPokemonLocalData(),1000)
    }

    cleanFavoriteData = () => {
        localStorage.clear()
        alert('Datos eliminados')
    }

    getPokemonLocalData = () => {
        const {pokemonAvatar, pokemonStats, firstFiveMoves, placetoFind} = this.state
        if (localStorage.getItem(0) === null || localStorage.getItem(1) === null || localStorage.getItem(2) === null || localStorage.getItem(3) === null ){
            alert('Sin datos del pokemón favorito, Guardalos apretando el botón "Guardar pokemón favorito" ')
            this.setState({
                pokemonAvatar : pokeBall,
            })
        } else {
            this.setState({
                pokemonAvatar : localStorage.getItem(0),
                pokemonStats : JSON.parse(localStorage.getItem(1)),
                firstFiveMoves : localStorage.getItem(2),
                placetoFind : localStorage.getItem(3)
            })
        }
    }

    render(){

        const {
            pokemonAvatar,
            pokemonStats : {
                id = "---",
                height = "---",
                pokeName = "---",
                weight = "---"
            },
            firstFiveMoves,
            placetoFind
        } = this.state

        return(
            <>
                <Paper elevation={3}>

                    <div className="favSection">                     
                        <div>
                            <img alt="imagen" className="image" src={pokemonAvatar}/>
                        </div>

                        <div>
                            <h3>Datos de tu Pokemon Favorito</h3>
                            <div>
                                <p>Nombre : {pokeName}</p>
                                <p>ID : {id}</p>
                                <p>Altura : {height}</p>
                                <p>Peso: {weight}</p>
                                <p>Movimientos: {firstFiveMoves}</p>
                                <p>Un lugar donde encontrarlo : {placetoFind}</p>
                            </div>
                        </div>
                    </div>                 
                </Paper>

                <br/>

                <Button variant="contained" size="small" onClick={this.cleanFavoriteData}>
                    Borra el almacenamiento local
                </Button>


            </>
        )
    }
}

export default PokeFav