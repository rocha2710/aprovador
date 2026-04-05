# Configuração do PocketBase

## Collections Necessárias

### 1. Collection: `exams`
Tipo: Base

Campos:
- `title` (text) - Título da prova
- `timePerQuestion` (number) - Tempo em minutos por questão
- `questions` (json) - Array de questões no formato:
```json
[
  {
    "text": "Texto da pergunta",
    "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D", "Alternativa E"],
    "correctIndex": 0
  }
]
```

### 2. Collection: `results`
Tipo: Base

Campos:
- `examId` (relation) → exams (single)
- `name` (text) - Nome do candidato
- `email` (email) - Email do candidato
- `matricula` (text) - Matrícula do candidato
- `score` (number) - Nota final (0 a 10)
- `answers` (json) - Respostas do candidato
- `completedAt` (autodate) - Data de conclusão

## Permissões

Para testes locais, defina as permissões das collections como:
- Create: ✓ Anyone
- Read: ✓ Anyone
- Update: ✓ Anyone (ou apenas Admin)
- Delete: ✓ Anyone (ou apenas Admin)

Em produção, restrinja conforme necessidade.
