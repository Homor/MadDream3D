/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-17 12:34:02
 * @Description: file content
 */

var MADDREAM  = window.MADDREAM||{};
/**@class
 * namespace for maddream
 * short version of MADDREAM
 */
var MDDM = MADDREAM;
var Epsilon = 0.0000000001;
function Vector4(x,y,z,w){
    
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    Vector4.prototype.copyFrom = function(vec4){
        
        this.x = vec4.x;
        this.y = vec4.y;
        this.z = vec4.z;
        this.w = vec4.w;
    }
}

function Vector3(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    Vector3.prototype.copyFrom = function(vec3){
        this.x = vec3.x;
        this.y = vec3.y;
        this.z = vec3.z;
    }
}

class MathUtil{
    static transposeArr(arr){
        return [arr[0],arr[4],arr[8],arr[12],
                arr[1], arr[5],arr[9],arr[13],
                arr[2], arr[6],arr[10],arr[14],
                arr[3],arr[7],arr[11],arr[15]];
    }


    static rotX(cita){
        var ra = cita*math.pi/180.0;
        var cosrc = math.cos(ra);
        var sinrc = math.sin(ra);
        var mat = math.matrix(
            [[1.0,  0,  0,    0],
             [0, cosrc,-sinrc,0],
             [0, sinrc,cosrc, 0],
             [0, 0,    0,     1]]);
        return mat;
    }

    static rotY(cita){
        var ra = cita*math.pi/180.0;
        var cosrc = math.cos(ra);
        var sinrc = math.sin(ra);
        var mat = math.matrix(
            [[cosrc,  0,  sinrc,   0],
             [0,      1,  0,       0],
             [-sinrc,  0, cosrc,   0],
             [0,       0,    0,    1]]);
        return mat;
    }

    static rotZ(cita){
        var ra = cita*math.pi/180.0;
        var cosrc = math.cos(ra);
        var sinrc = math.sin(ra);
        var mat = math.matrix(
            [[cosrc,  -sinrc,  0,  0],
             [sinrc,   cosrc,  0,   0],
             [0,       0,    1.0,  0],
             [0,       0,    0,     1]]);
        return mat;
    }

    static scale(x,y,z){
        var mat = math.matrix(
            [[x,  0,  0,  0],
             [0,  y,  0,  0],
             [0,  0,  z,  0],
             [0,  0,  0,  1]]);
        return mat;
    }
    static translate(x,y,z){
        var mat = math.matrix(
            [[1.0,  0,  0,  x],
             [0,  1.0,  0,  y],
             [0,  0,  1.0,  z],
             [0,  0,  0,  1]]);
        return mat;
    }

    static isPowerOf2(value){
        return (value & (value-1)) === 0;
    }

    static getLength(vec3,y,z){
        if(vec3 instanceof(Vector3)){
            return math.sqrt(vec3.x*vec3.x+vec3.y*vec3.y+vec3.z*vec3.z);
        }else if(typeof(vec3) == "number"){
            return math.sqrt(vec3*vec3+y*y+z*z);
        }else if(vec3 instanceof(Vector4)){
            return math.sqrt(vec3.x*vec3.x+vec3.y*vec3.y+vec3.z*vec3.z +vec3.w*vec3.w);
        }
    }

    static normalize(vec3){
        var len = this.getLength(vec3);
        if(len<Epsilon){
            console.warn("warning: two small");
        }
        return new Vector3(vec3.x/len,vec3.y/len,vec3.z/len);
    }
    static multiplyV3(vec1,vec2){
        if(vec1 instanceof(Vector3) && vec2 instanceof(Vector3)){
            return new Vector3(vec1.x*vec2.x,vec1.y*vec2.y,vec1.z*vec2.z);
        }else{
            console.error("multiplyV3, parameter not Vector3");
            return null;
        }
        
    }
    static multiplyMat(mat1,mat2){
        return math.multiply(mat1,mat2);
    }

    static vec3ToArr(vec3){
        return new Float32Array([vec3.x,vec3.y,vec3.z]);
    }

    static mat2Arr(matrix){
        return new Float32Array(
             math.flatten(
                 math.transpose(matrix)._data));
     }

    static vec3MultiMat4(vec3,mat,w){
        if(w==undefined){
            w =1.0;
        }
        var p = math.matrix([[vec3.x],[vec3.y],[vec3.z],[w]]);
        var rep  = math.flatten(math.multiply(mat,p));
        return new Vector4(rep._data[0],rep._data[1],rep._data[2],rep._data[3]);
        
    } 
    static vec4MultiMatrix(vec4,mat){
         var p = math.matrix([[vec4.x],[vec4.y],[vec4.z],[vec4.w]]);
         var rep  = math.flatten(math.multiply(mat,p));
         return new Vector4(rep._data[0],rep._data[1],rep._data[2],rep._data[3]);
    }

    static getNormalMatrixArr(/**@type{Matrix} */modelInv,
        /**@type{Matrix} */viewInv){
            // normalMatrix = vM.inv.T = (M.inv*V.Inv).T
            return MathUtil.mat2Arr(
                math.transpose(math.multiply(modelInv,viewInv)));
        
    }

    static isNone(a){
        if(a===null || a===undefined){
            return true;
        }
    }

    static bucketSortDict(arr,elementFunc,max,min){
        var buckets = [];
        var ndict = {};
        var size = max -min +1;
        for (var i=0; i<size; i++){
            buckets[i] = 0;
        }
        for(var j=0; j<arr.length; j++){
            var m = arr[j];
            var elemval = elementFunc(m);
            if(elemval >max){
                console.error("the value excede the maxmum");
                return null;
            }
            if( buckets[elemval] !==0){
                buckets[elemval].push(m);
            }else{
                buckets[elemval] = [m];
            }
        }
        for(var k =0; k<size;k++){
            if(buckets[k]!==0){
                ndict[k] = buckets[k];
            }
        }
        return ndict;
        
    }

    static bucketSort(arr,elementFunc,max,min){
        var buckets = [];
        var newArr = [];
        var size = max -min +1;
        for (var i=0; i<size; i++){
            buckets[i] = 0;
        }
        for(var j=0; j<arr.length; j++){
            var m = arr[j];
            var elemval = elementFunc(m);
            if(elemval >max){
                console.error("the value excede the maxmum");
                return null;
            }
            if( buckets[elemval] !==0){
                buckets[elemval].push(m);
            }else{
                buckets[elemval] = [m];
            }
        }
        for(var k =0; k<size;k++){
            if(buckets[k]!==0){
                for(var t=0; t<buckets[k].length; t++){
                    newArr.push(buckets[k][t]);
                }
            }
        }
        return newArr;
    }

    
}