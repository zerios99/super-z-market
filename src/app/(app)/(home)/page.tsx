import configPromise from "@payload-config";
import { getPayload } from "payload";

export default async function Home() {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
  });

  return <div>{JSON.stringify(data, null, 2)}</div>;
}

//PA2zi8NAuJhXDrsj

//mongodb+srv://zerios:PA2zi8NAuJhXDrsj@cluster0.wswzo7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

//admin@demo.com
//admin
