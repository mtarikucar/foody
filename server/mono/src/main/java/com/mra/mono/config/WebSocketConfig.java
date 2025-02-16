package com.mra.mono.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000","http://localhost:3001","http://localhost:5173","https://management.philofoody.com","https://branch.philofoody.com","https://api.philofoody.com") // React uygulamasının URL'sini buraya ekleyin
                .addInterceptors(new HttpSessionHandshakeInterceptor()) // HttpSessionHandshakeInterceptor ekleyerek HttpSession'ı kullanarak oturum yönetimini etkinleştirin
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Basit bir mesaj brokırını etkinleştirin. Bu, mesajların gönderileceği destinasyonları belirtir.
        registry.enableSimpleBroker("/topic");

        // Uygulama tarafından işlenecek mesajların prefix'ini belirleyin.
        registry.setApplicationDestinationPrefixes("/app");
    }
}
