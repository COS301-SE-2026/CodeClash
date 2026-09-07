import path from "node:path";
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CodeClash API',
            version: '1.0.0',
            description: 'API documentation for CodeClash backend',
        },
        servers: [{url: 'http://localhost:3000' }],
    },
    apis: [path.join(__dirname, '../routes/*.ts')],
};

//Try-Catch block so that tests don't fail when trying to fetch swagger and failing
export const swaggerSpec = (() => {
    try{
        return swaggerJSDoc(options);
    }catch{
        return {};
    }
})();