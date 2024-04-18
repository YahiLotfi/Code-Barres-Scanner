package org.example;

import spark.ModelAndView;
import spark.Spark;
import spark.template.thymeleaf.ThymeleafTemplateEngine;
import java.io.IOException;
import java.util.HashMap;


public class Main {

    public static void main(String[] args) throws IOException {

        Spark.webSocket("/websocket/echo", EchoWebSocket.class);
        Spark.get("/", (request, response) -> {

           return "hello world";

                });
        Spark.get("/echo", (request, response) -> {

            HashMap<String, Object> model = new HashMap<>();
            return new ThymeleafTemplateEngine().render (new ModelAndView(model, "echoview"));
        });

        Spark.init();



    }

}