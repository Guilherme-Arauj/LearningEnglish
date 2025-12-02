import app from "./app"
import { PORT } from "../env/envConfig";


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});