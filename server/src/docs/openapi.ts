import swaggerJsdoc from "swagger-jsdoc";

const spec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Growladder API", version: "1.0.0" },
    components: {
      schemas: {
        Employee: {
          type: "object",
          properties: {
            id: { type: "string" },
            fullName: { type: "string" },
            unitId: { type: "string", nullable: true },
            rank: { type: "string", nullable: true },
            hireDate: { type: "string", format: "date-time", nullable: true },
            positionStartDate: { type: "string", format: "date-time", nullable: true },
            isActive: { type: "boolean", default: true },
          },
        },
        Course: {
          type: "object",
          properties: {
            courseId: { type: "string" },
            title: { type: "string" },
            isActive: { type: "boolean", default: true },
          },
        },
        JobRequirement: {
          type: "object",
          properties: {
            id: { type: "string" },
            unitId: { type: "string", nullable: true },
            jobTitle: { type: "string" },
            courseId: { type: "string" },
            type: { type: "string", nullable: true },
            priority: { type: "string", nullable: true },
          },
        },
        Training: {
          type: "object",
          properties: {
            id: { type: "string" },
            employeeId: { type: "string" },
            courseId: { type: "string" },
            attendancePercent: { type: "number", nullable: true },
            date: { type: "string", format: "date-time", nullable: true },
            status: { type: "string", nullable: true },
          },
        },
      },
    },
    paths: {
      "/api/employees": {
        get: { summary: "List employees" },
        post: {
          summary: "Create employee",
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Employee" } },
            },
          },
        },
      },
      "/api/employees/{id}": {
        get: { summary: "Get employee" },
        put: { summary: "Replace employee" },
        patch: { summary: "Update employee" },
        delete: { summary: "Delete employee" },
      },
      "/api/courses": {
        get: { summary: "List courses" },
        post: {
          summary: "Create course",
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Course" } },
            },
          },
        },
      },
      "/api/courses/{id}": {
        get: { summary: "Get course" },
        put: { summary: "Replace course" },
        patch: { summary: "Update course" },
        delete: { summary: "Delete course" },
      },
      "/api/job-requirements": {
        get: { summary: "List job requirements" },
        post: {
          summary: "Create job requirement",
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/JobRequirement" } },
            },
          },
        },
      },
      "/api/job-requirements/{id}": {
        get: { summary: "Get job requirement" },
        put: { summary: "Replace job requirement" },
        patch: { summary: "Update job requirement" },
        delete: { summary: "Delete job requirement" },
      },
      "/api/trainings": {
        get: { summary: "List trainings" },
        post: {
          summary: "Create training",
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Training" } },
            },
          },
        },
      },
      "/api/trainings/{id}": {
        get: { summary: "Get training" },
        put: { summary: "Replace training" },
        patch: { summary: "Update training" },
        delete: { summary: "Delete training" },
      },
      "/api/bulk/employees/upsert": {
        post: {
          summary: "Bulk upsert employees",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rows: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Employee" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/bulk/courses/upsert": {
        post: {
          summary: "Bulk upsert courses",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rows: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Course" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/bulk/job-requirements/upsert": {
        post: {
          summary: "Bulk upsert job requirements",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rows: {
                      type: "array",
                      items: { $ref: "#/components/schemas/JobRequirement" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/bulk/trainings/upsert": {
        post: {
          summary: "Bulk upsert trainings",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rows: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Training" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
});

export { spec };
