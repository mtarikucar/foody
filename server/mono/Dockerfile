FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# 2. Aşama: Sadece jar'ı çalıştıran daha ufak bir image oluştur
FROM openjdk:17-jdk-alpine

WORKDIR /app
# build aşamasından gelen jar dosyasını kopyalıyoruz
COPY --from=build /app/target/mono-0.0.1-SNAPSHOT.jar app.jar

# 8080 portundan dinleyecek
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
