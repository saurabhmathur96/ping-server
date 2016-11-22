# Ping

| HTTP Verb | URL           | Request Format | Response Format |Remarks  | 
| --------- |:-------------:| --------------:| ---------------:| -------:|
| POST      | /users        |`{ username: String, password: String }`| `{ id: String, username: String }` | Register a new user. |
| POST      | /tokens       |`{ username: String, password: String }`| `{ token: String }` | Authenticate a user. |