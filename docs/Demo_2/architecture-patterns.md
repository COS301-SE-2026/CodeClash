# Architectural Patterns

## Client-Server

The System as a whole uses a client server pattern. The frontend of the application acts as a client that connects to the backend, acting as a server, through Websockets and  API gateways.


## Layered Pattern

The backend or the system is implemented with a layered architecture. The layers are design to follow CLEAN Architecture, which organizes the application into a set of layers each with clearly defined responsibilities. 

The most important feature of this pattern is its dependency rule. 

```
Dependencies can only point inwards.
```

This means only outer layers are allowed to know of the existence of inner layers. 
Application layer code , for example, cannot know of the existence of the frameworks used to implement the database. 

This allows separation of concern, flexibility and modularity. It means the database can be swapped out without having to change any code on the inner layers. 

### Entity Layer
    the inner most layer of CLEAN Architecture encapsulates business rules. 
    Entities are designed to be used system wide in many different applications. 

    Entites are represented by database-entities, Entity Component System (ECS) entities and ECS components. 

### Application Layer
    The application layer contains all application specific logic. It consist of application use cases and it exposes interfaces for the layer to folloe. 

    This layer encapsulates and implements the flow of data to and from entities. 
    Changes in this layer should not affect the entities. This layer is also isolated from exteranl database, ui or frameowkr changes. 
    
    Changes to application operations will affect application use cases, and will therefore affect this layer. 

### Interface Adapters

    This layer is responsible for converting data from a format convenient for the usecase, to a format that can be used by external system such as the database or client. 

    This layer provides abstraction that prevents the Entity and Application layers from knowing anything about external systems. Such that those external systems can be changed without having to rewrite application code. 

### Frameworks and Drivers 
    This is the outermost layer of the architectural pattern. 

    This is where all configuration of frameworks and wiring is kept. All the details of specific technologies and systems are kept here so the don't have an impact of the internal layers. 

## Event Driven Architecture 

Time is a determining factor in who wins a match and who loses. Therefore, in the interest of speed, the game system of CodeClash is managed with websocket and redis caches. 

The server acts as the event bus for this architecture. It routes all messages from the frontend client to the use cases that execute and return responses back through the server. 

