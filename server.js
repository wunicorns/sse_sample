const {v4: uuidv4} = require('uuid')

const express = require('express');

const PORT = process.env.PORT || 5001;

const app = express();

const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', __dirname + '/web');

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const localCache = {};

function runner(){

    setInterval(()=>{

        for(const [id, res] of Object.entries(localCache)){
            
            res.write(`event:globalNotification\ndata:${JSON.stringify({
                messageId: uuidv4(),
                to: id,
                data: "hello world! "
            })}\n\n`);

        }

    }, 2000);
    
    setInterval(()=>{

        for(const [id, res] of Object.entries(localCache)){
            
            res.write(`event:personalNotification\ndata:${JSON.stringify({
                messageId: uuidv4(),
                to: id,
                data: "hello world! "
            })}\n\n`);

        }

    }, 4000);

}


app.get('/', (req, res, next)=>{
    res.render('index.html');
});

app.get('/init', (req, res, next)=>{

    res.json({
        id: uuidv4(),
        error: 0
    });

});


app.get('/api/start', (req, res, next)=>{

    // console.log(req.originalUrl);
    console.log(req.params);

    res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=UTF-8',
        'Connection': 'keep-alive',
        'Cache-Control': ' no-cache'
    });
    
    localCache[req.params.id] = res;

});

app.delete('/api/stop/:id', (req, res, next)=>{

    clearInterval(localCache[req.params.id]);    
    delete localCache[req.params.id];

});

app.listen(PORT, ()=>{
    console.log( `listen ${PORT} `)
    runner();
});