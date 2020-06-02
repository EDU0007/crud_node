const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({limit:'100mb'}))

app.get('/home', (req, res) => {
    res.render('home')
})
app.listen(300)

//conexao com o banco//
mongoose.connect('mongodb://localhost/vendas', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Produtos = mongoose.model('produtos',{
    nome: String,
    vlUnit: Number,
    codigoBarras: String
})
//template//

//rota que busca todos os dados no servidor mongo//
app.get('/produtos', (req, res) => {
    let produto = Produtos.find({}, (err,produto)=>{
        if (err) {
            console.error(err)
            res.status(500).send("erro ao consultar o banco")
        }
        res.render('produtos' ,{produto:produto})
    } )
})
//rota que insere dados//
app.post('/produtos',(req,res)=>{
    let dados = req.body
    let produto  = new Produtos()
    produto.nome = dados.nome
    produto.vlUnit = dados.vlUnit
    produto.codigoBarras = dados.codigoBarras
    produto.save(err=>{
        if (err){
            return res.status(500).send("erro ao salvar produtos")
        }else{
            return  res.redirect('/produtos')
        }

    })
})


