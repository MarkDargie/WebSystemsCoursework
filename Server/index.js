import {express} from 'express';

const app = express();
const port = 300;




// list on port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })