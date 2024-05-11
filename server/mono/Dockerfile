# Stage 1: Derleme aşaması
FROM maven:3.8.4-openjdk-17 as build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src src/
RUN mvn package -DskipTests  # Projeyi derle, testleri atla

# Stage 2: Çalıştırma aşaması
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/mono-0.0.1-SNAPSHOT.jar mono.jar

# Uygulamayı başlat
CMD ["java", "-jar", "mono.jar"]


