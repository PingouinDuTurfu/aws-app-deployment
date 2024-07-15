# AWS Rendu

## Schema

![Archi_Perspective2](https://github.com/exlineo-corp/cy2023-perpective2-aws-PingouinDuTurfu/assets/91423302/addf5700-2c9c-43c0-bb97-6e1c9d246481)

# Guide d'utilisation de l'API

## Endpoint actuel
L'endpoint actuel de l'API est : `https://mh9o1gp1xe.execute-api.eu-west-3.amazonaws.com/prod/`
En cas de nouveau deploy le endpoint sera différent.

## Exemples de requêtes
Voici quelques exemples de body de requête pour différentes opérations :

### Création
```json
{
    "id" : "event-1",
    "titre" : "ceci est l'evenement 1",
    // Autres attributs...
}
```

### Mise à jour
```json
{
    "Key" : {
        "id":"event-1"
    },
    "ExpressionAttributeNames":{
        "#titre" : "label" 
    },
    "ExpressionAttributeValues":{
        ":default":  "ceci est toujours l'evenement 1"
    },
    "UpdateExpression": "SET #titre= :default"
}
```

### Suppression
```json
{
    "Key" : {
        "id":"event-1"
    }
}
```

N'oubliez pas d'ajuster les valeurs des attributs selon vos besoins.

# Authors
Axel Lanta @NeozFuzzion (lantaxel@cy-tech.fr) <br/>
Rémy Ollivier @PingouinDuTurfu (ollivierre@cy-tech.fr) <br/>
Edouard Outrebon @EdouardOutrebon (outreboned@cy-tech.fr) 
