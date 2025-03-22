# TaskManager

## Описание

Простое приложение для управления задачами, которое поможет вам эффективно организовывать свои задачи.

## Инструкции по установке

Следуйте этим инструкциям, чтобы настроить проект на вашем локальном компьютере.

### Предварительные требования

* **Git:** Убедитесь, что у вас установлен Git. Вы можете скачать его с <https://git-scm.com/>.
* **Node.js:** Убедитесь, что у вас установлен Node.js. Скачайте его с <https://nodejs.org/>.
* **npm** (Менеджер пакетов Node): npm обычно поставляется вместе с установкой Node.js. Вы можете проверить установку, выполнив команду `npm -v` в вашем терминале.
* **PostgreSQL:** Убедитесь, что у вас установлена и запущена СУБД PostgreSQL.

### Установка

1.  **Клонируйте репозиторий:**

    Откройте свой терминал и перейдите в каталог, в котором вы хотите хранить проект. Затем клонируйте репозиторий, используя следующую команду:

    ```bash
    git clone [https://github.com/Myky312/TaskManager.git](https://github.com/Myky312/TaskManager.git)
    ```

2.  **Перейдите в каталог проекта:**

    ```bash
    cd TaskManager
    ```

3.  **Установите зависимости:**

    ```bash
    npm install
    ```

4.  **Настройка базы данных:**

    * Убедитесь, что сервер PostgreSQL запущен, и вы создали необходимую базу данных.
    * **Создайте файлы `.env` и `.env.test` в корне проекта.**
    * Файл `.env` должен содержать переменные окружения для разработки:

        ```
        DATABASE_URL="postgresql://postgres:1234@localhost:5432/mytaskdb"
        JWT_SECRET="sampleKeyForJWT"
        PORT=3000
        ```

    * Файл `.env.test` должен содержать переменные окружения для тестирования:

        ```
        DATABASE_URL="postgresql://postgres:1234@localhost:5432/mytaskdb_test"
        JWT_SECRET="sampleKeyForJWT"
        PORT=3000
        ```
    * **Выполните миграции Prisma:**

        ```bash
        npx prisma migrate
        ```

5.  **Конфигурация:**

    * Если проект требует какой-либо конкретной конфигурации, например ключей API или переменных среды, создайте файлы `.env` и `.env.test` в корневом каталоге. Скопируйте содержимое из `.env.example` (если предоставлено) и измените значения по мере необходимости.
    * **Важно:** Не добавляйте файлы `.env` и `.env.test` в репозиторий, так как они могут содержать конфиденциальную информацию. Они уже находятся в файле `.gitignore`.

6.  **Запустите приложение:**

    * Поскольку у вас только серверная часть, запустите ее с помощью команды:

        ```bash
        npm run start #или команду для запуска сервера, проверьте package.json
        ```

7.  **Запустите тесты:**

    * Запустить тесты можно с помощью команды:

        ```bash
        npm run test:e2e
        ```

8.  **Swagger UI:**

    * Если все тесты пройдены и приложение работает, вы можете просмотреть документацию API, перейдя по адресу:

        ```
        http://localhost:3000/api#/
        ```