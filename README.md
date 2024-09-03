# ES3
## Integrantes
 - André Richard Michael Cardoso (ARMCardoso)
 - Gabriel Alves Rodrigues (GabrielAlves027)
 - Gulherme de Freitas Diniz (guilhermedefreitasdiniz’s)
 - Ítalo Béllo Silva (Lflickr)
 - Kaike Freitas de França (KaikeFF)

## Organização do projeto
Projeto organizado pela plataforam trello
link:
## Resumo do projeto

## Tecnologias utilizadas 
### Front-End
 - HTML5
 - CSS3
 - JavaScript
 - Bootstap

### Back-End
 - Node.js
   
### Banco de dados
 - Oracle
   
### Ferramentas
 - SQLDeveloper
 - BRmodelo
 - VS Code
 - Balsamiqs mockups
   
## Casos de uso
```mermaid
    %% Casos de Uso

    actor J as "Jogador"
    actor D as "Dono de quadra"

    %% Pacote System
    classDiagram
        class UC1 as "Editar time"
        class UC2 as "Adicionar jogador"
        class UC3 as "Marcar amistoso"
        class UC4 as "Agendar partida"
        class UC5 as "Criar time"
        class UC6 as "Adicionar Jogadores"
        class UC7 as "Solicitar entrar em time"
        class UC8 as "Entrar em time"
        class UC9 as "Definir escalamento de time"
        class UC10 as "Marcar campeonato"
        class UC11 as "Disponibilizar quadra"
        class UC12 as "Editar campeonato"

    %% Relacionamentos
    J --> UC1
    J --> UC2
    J --> UC3
    J --> UC4
    J --> UC5
    J --> UC6
    J --> UC7
    UC7 --|> UC8 : <extends>
    J --> UC9

    D --> UC10
    D --> UC11
    D --> UC12
```
## DER

## Diagrama de classes
