/*

This is the Dev Server and we decouple the Vite from production environment
Here, we use Vite in middleware mode with our express app.

*/

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createServer = async (
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  hmrPort
) => {
  const resolve = (p) => path.resolve(__dirname, p);

  const indexProd = isProd
    ? fs.readFileSync(resolve("dist/client/index.html"), "utf-8")
    : "";

  const app = express();

  let vite;

  if (!isProd) {
    //

    vite = await (
      await import("vite")
    ).createServer({
      root,
      logLevel: "info",
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    app.use(vite.middlewares);
    //
  } else {
    //

    app.use((await import("compression")).default());
    app.use(
      (await import("serve-static")).default(resolve("dist/client"), {
        index: false,
      })
    );
  }

  app.use("*", async (req, res) => {
    const url = req.originalUrl;

    try {
      //

      let template, render;

      if (!isProd) {
        //
        // always read fresh template in dev

        template = fs.readFileSync(resolve("../index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("./src/entry-server.jsx")).render;

        //
      } else {
        template = indexProd;
        render = (await import("./dist/server/entry-server.jsx")).render;
      }

      const context = {};
      const appHtml = render(url, context);

      if (context.url) {
        return res.redirect(301, context.url);
      }

      const html = template.replace(`<!--ssr-outlet-->`, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);

      //
    } catch (e) {
      // handle err

      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
};

createServer().then(({ app }) =>
  app.listen(8080, () => {
    console.log("http://localhost:8080");
  })
);

export default createServer;
