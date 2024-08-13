const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');

app.get('/', (req, res)=>{
    res.send('Hello Word');
})

app.get('/:cep', async (req, res)=>{
    const cep = req.params.cep;
    const cepRegex = /^[0-9]{5}-?[0-9]{3}$/
    try{
        if(!cepRegex.test(cep)){
            res.status(400).send('Formato errado XXXXX-XXX')
        }else{
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            res.json(response.data);
        }
    }catch (error){
        res.status(500).send('Erro ao consultar o CEP')
    }
});

app.get('/pokemon/:pokemon', async (req, res)=>{
    const pokemon = req.params.pokemon;
    try{
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        res.json(response.data);
    }catch (error){
        console.error('Erro ao fazer requisição', error)
        res.status(500).send('Erro ao consultar o CEP')
    }
});

app.get('/novarota', (req, res)=>{
    res.send('Nova rota criada')
})

app.listen(port, ()=>{
    console.log(`Servidor rodando em http://localhost:${port}`);
})