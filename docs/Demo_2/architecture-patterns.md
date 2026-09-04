# Architectural Patterns

## Client-Server

The System uses a client server pattern. 
The frontend of the application acts as a client that connects to the backend, acting as a server, through Websockets and API gateways.

## Layered Pattern

The backend or the system is implemented with a layered architecture. The layers are designed to follow CLEAN Architecture, which organizes the application into a set of layers each with clearly defined responsibilities. 

The most important feature of this pattern is its dependency rule. 

<Dependencies can only point inwards>

This means only outer layers are allowed to know of the existence of inner layers. 
Application layer code, for example, cannot know of the existence of the frameworks used to implement the database. 

This allows separation of concern, flexibility and modularity. It means the database can be swapped out without having to change any code on the inner layers. 

Dependency injecion is used to pass interfaces, defined in the application layer, through to services that need particular objects or functions.

### Entity Layer
The inner most layer of CLEAN Architecture encapsulates business rules. 
Entities are designed to be used system wide in many different applications. 

Entities are represented by database-entities, Entity Component System (ECS) entities and ECS components. 

database-entities are used to represent database tables, such that repositores can be used to manipulate the data. 

ECS entities encapsulate objects and represent thier identifiers. Entites are used to uniquely identiy lists of components that give objects characteristics and data. 

### Application Layer
The application layer contains all application specific logic. It consists of application use cases, and it exposes interfaces for the layer to follow. 

This layer encapsulates and implements the flow of data to and from entities. 
Changes in this layer should not affect the entities. This layer is also isolated from external database, Ui or frameworks changes. 

Use cases defined in this layer are repsonsible for orchestrating application specific operations that act on entities. 

The interfaces defined in this layer are responsible for exposes the interfaces for the necessary services in the Interface Adapter layer, such that use cases are able to carry out thier operations. 

### Interface Adapters
This layer is responsible for converting data from a format convenient for the use case, to a format that can be used by external system such as the database or client. 

This layer provides abstraction that prevents the Entity and Application layers from knowing anything about external systems. Such that those external systems can be changed without having to rewrite application code. 

### Frameworks and Drivers 
This is the outermost layer of the architectural pattern. 

This is where all configuration of frameworks and wiring is kept. All the details of specific technologies and systems are kept here so they do not have an impact of the internal layers. 

## Event Driven Architecture 

Time is a determining factor in who wins a match and who loses. For fast communication,  the game system of CodeClash is managed with Websocket and Redis caches. This allows faster message relays and responses the HTTP requests would provide. 

It also allows much faster look ups, Websocket combined with fast Redis cache allow submission services to execute faster than they would with HTTP requests. This means request turn around time doesn't impact players speed and winning capability. 

The server acts as the event bus for this architecture. It routes all messages from the frontend client to the use cases that execute and return responses back through the server. 


## Model, View, View Model

The frontend of the application is represented by a presentation layer implemented with mvvm. 

Models describe how data will be structures, views simply display data to the client and view models encapsulate all business logic regarding populating the view. 

This includes API requests, Websocket event emmission and any calculations and transformations needed to present data to the client. 
