# Stage 1: Build the application with Maven
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# If you have .mvn/ and mvnw committed, add these lines:
# COPY .mvn .mvn
# COPY mvnw .
# RUN chmod +x mvnw
RUN mvn clean package -DskipTests

# Stage 2: Lightweight runtime image
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
WORKDIR /app
# Copy the ACTUAL executable JAR (matches your output: DFMP_BACKEND-*.jar)
# The * handles any version/SNAPSHOT changes without breaking future builds
COPY --from=build /app/target/DFMP_BACKEND-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]