class InnitItem{
    constructor(name, initNum, isHidden){
		this.name = name;
        if(!initNum){
            initNum = 0;
        }
        else{
		    this.initNum = initNum;
        }
		if(!isHidden){
			this.isHidden = false;
		}
        else{
            this.isHidden = isHidden;
        }
        this.isPlayer = false;
	}
}

class Clock{
    constructor(name, maxSize, isHidden){
        this.name = name;
        this.maxSize = maxSize;
        if(!isHidden){
            this.isHidden = false;
        }
        else{
            this.isHidden = isHidden;
        }
        this.count = 0;
    }
}

exports.InnitItem = InnitItem;
exports.Clock = Clock;