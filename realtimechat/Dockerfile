FROM maven:3.9-eclipse-temurin-21

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

RUN echo "=== JAVA VERSION ===" && java -version
RUN echo "=== MAVEN VERSION ===" && mvn -version
RUN echo "=== POM JAVA VERSION ===" && grep -n "java.version" pom.xml

RUN mvn clean package -DskipTests -Dmaven.compiler.release=21

EXPOSE 8080

CMD ["sh", "-c", "java -jar target/*.jar"]