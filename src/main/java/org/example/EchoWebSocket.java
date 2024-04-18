package org.example;


import org.eclipse.jetty.websocket.api.*;
import org.eclipse.jetty.websocket.api.annotations.*;
import org.json.JSONObject;
import org.json.JSONException;

import java.io.IOException;
import java.io.InputStreamReader;

import java.io.*;
import java.net.HttpURLConnection;
import java.util.*;
import java.util.concurrent.*;
import  java.net.URL;


@WebSocket
public class EchoWebSocket {

    // Store sessions if you want to, for example, broadcast a message to all users
    private static final Queue<Session> sessions = new ConcurrentLinkedQueue<>();

    @OnWebSocketConnect
    public void connected(Session session) {
        sessions.add(session);
    }

    @OnWebSocketClose
    public void closed(Session session, int statusCode, String reason) {
        sessions.remove(session);
    }

    @OnWebSocketMessage
    public void message(Session session, String message) throws IOException {

        BufferedReader reader;
        String line;

        StringBuffer responseContent = new StringBuffer();
        try {
            URL url = new URL("https://world.openfoodfacts.org/api/v0/product/" + message + ".json"); // Subscription to the service is mandatory to get a license key!
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();



            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            int status = connection.getResponseCode();

            if (status > 299) {
                reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
                while ((line = reader.readLine()) != null) {
                    responseContent.append(line);

                }
                reader.close();
            } else {
                reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                while ((line = reader.readLine()) != null) {

                    responseContent.append(line);
                }
                reader.close();

            }

            JSONObject GS = new JSONObject(responseContent.toString());
            JSONObject GG = GS.getJSONObject("product");

            String nutriscore;
            String ecoscore;
            String code;
            if (GG.has("_id")) {
                // score= GG.getString("nutriscore_grade");
                code = GG.optString("_id");
            } else {

                nutriscore = "non renseigné ";
            }
            if (GG.has("nutriscore_grade")) {
                // score= GG.getString("nutriscore_grade");
                nutriscore = GG.optString("nutriscore_grade");
            } else {

                nutriscore = "non renseigné ";
            }
            if (GG.has("ecoscore_grade")) {
                // score= GG.getString("nutriscore_grade");
                ecoscore = GG.optString("ecoscore_grade");
            } else {

                ecoscore = "non renseigné ";
            }

            session.getRemote().sendString("Nutriscore_grade : " + nutriscore + " Ecoscore_grade : " + ecoscore);
        } catch (JSONException e) {
            session.getRemote().sendString("Il faut scanner un code bar d'un produit alimentaire sinon bien scanner votre code si c'est un produit alimentaire");
/*gerer l'exception JSONException en cas de code bar non valide pour le site openfood*/
        }


    }


}