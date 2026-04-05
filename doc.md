# Configuração PocketBase - Sistema Aprovador

### Coleção: `aprovador_exams`

| Coluna | Tipo |
| :--- | :--- |
| `title` | Text |
| `timePerQuestion` | Number |
| `questions` | JSON |

### Coleção: `aprovador_results`

| Coluna | Tipo |
| :--- | :--- |
| `examId` | Relation (aprovador_exams) |
| `name` | Text |
| `email` | Email |
| `matricula` | Text |
| `score` | Number |
| `answers` | JSON |
