"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProcesoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_proceso_dto_1 = require("./create-proceso.dto");
class UpdateProcesoDto extends (0, mapped_types_1.PartialType)(create_proceso_dto_1.CreateProcesoDto) {
}
exports.UpdateProcesoDto = UpdateProcesoDto;
//# sourceMappingURL=update-proceso.dto.js.map