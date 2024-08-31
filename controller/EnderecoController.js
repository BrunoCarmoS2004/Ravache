const { Endereco } = require('../models');
const express = require('express');
const app = express();
const axios = require('axios');
const endereco = require('../models/endereco');
app.use(express.json());
exports.createEndereco = async (req, res) => {
    try {
        const cep = req.params.cep;
        const numero = req.body.numero;
            const cepRegex = /^[0-9]{5}-?[0-9]{3}$/
            try{
                if(!cepRegex.test(cep)){
                    res.status(400).send('Formato errado XXXXX-XXX')
                }else{
                    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`); 
                    if (response.erro) {
                        return res.status(404).send('CEP não encontrado');
                    }               
                    console.log(response.data)
                    const novoEndereco = await Endereco.create({
                    Cep: response.data.cep,
                    Logradouro: response.data.logradouro,
                    Numero: numero, 
                    Complemento: response.data.Complemento, 
                    Bairro: response.data.bairro,
                    Cidade: response.data.localidade,
                    Estado: response.data.uf,
                    MunicipioIBGE: response.data.ibge
                    });
                    return res.status(201).json(novoEndereco);
                }
            }catch (error){
                res.status(500).send({error:'Erro ao consultar o CEP', details:error.message})
            }    
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar endereço', details: error.message });
    }
};

exports.getAllEnderecos = async (req, res) => {
    try {
        const enderecos = await Endereco.findAll();
        res.status(200).json(enderecos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar endereços', details: error.message});
    }
};

exports.getEnderecoById = async (req, res) => {
    try {
        const { Id } = req.params;
        const endereco = await Endereco.findByPk(Id);

        if(!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado' });
        }

        res.status(200).json(endereco);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar endereço', details: error.message });
    }
}

exports.updateEndereco = async (req, res) => {
    try {
        const { Id } = req.params;
        const { Cep, Logradouro, Numero, Complemento, Bairro, Cidade, Estado, MunicipioIBGE } = req.body;

        const endereco = await Endereco.findByPk(Id);

        if (!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado' });
        }
        endereco.Cep = Cep;
        endereco.Logradouro = Logradouro;
        endereco.Numero = Numero;
        endereco.Complemento = Complemento;
        endereco.Bairro = Bairro;
        endereco.Cidade = Cidade;
        endereco.Estado = Estado;
        endereco.MunicipioIBGE = MunicipioIBGE;

        await endereco.save();

        res.status(200).json(endereco);
    } catch(error) {
        res.status(500).json({ error: 'Erro ao atualizar endereço', details: error.message });
    }
};

exports.deleteEndereco = async (req, res) => {
    try {
        const { Id } = req.params;

        const endereco = await Endereco.findByPk(Id);

        if (!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado' });
        }

        await endereco.destroy();

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar endereço', details: error.message });
    }
};
