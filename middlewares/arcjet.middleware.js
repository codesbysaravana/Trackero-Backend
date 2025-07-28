//ARCJET RULES
import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const descion = await aj.protect(req, { requested: 1 }); //goes to rules in config // { requested: takes away one token from the user curr}

        //if request gets denied 
        if(descion.isDenied()) {
            //check if req is RateLimit || Bot
            if(descion.reason.isRateLimit()) return res.status(429).json({ message: "Rate limit exceeded" });
            if(descion.reason.isBot()) return res.status(403).json({ message: "Bot Detected" });
             
            return res.status(403).json({ error: 'Access Denied' });
        }

        next();
    } catch(error) {
        console.log(`"ArcJet Middleware Error": ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;

//COMPLETLy FOR RATE LIMITING
//TOKEN BUCKET ALGORITHM!!