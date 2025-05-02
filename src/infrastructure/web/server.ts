import app from "./app"
import { PORT } from "../env/envConfig";


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});