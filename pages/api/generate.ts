import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

//👇🏻 disables the default Next.js body parser
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await readFile(req, true);
  
    res.status(200).json({ message: "Processing!" });
  }
  

//👇🏻 creates a writable stream that stores a chunk of data
const fileConsumer = (acc: any) => {
    const writable = new Writable({
        write: (chunk, _enc, next) => {
            acc.push(chunk);
            next();
        },
    });

    return writable;
};

const readFile = (req: NextApiRequest, saveLocally?: boolean) => {
    // @ts-ignore
    const chunks: any[] = [];
    //👇🏻 creates a formidable instance that uses the fileConsumer function
    const form = formidable({
        keepExtensions: true,
        fileWriteStreamHandler: () => fileConsumer(chunks),
    });

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields: any, files: any) => {
            //👇🏻 converts the image to base64
            const image = Buffer.concat(chunks).toString("base64");
            //👇🏻 logs the result
            console.log({
                    image,
                    email: fields.email[0],
                    gender: fields.gender[0],
                    userPrompt: fields.userPrompt[0],
            });

            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};
