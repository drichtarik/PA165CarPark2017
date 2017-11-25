package cz.muni.fi.pa165.facade;

import cz.muni.fi.pa165.dao.CarDAO;
import cz.muni.fi.pa165.dto.*;
import cz.muni.fi.pa165.dto.results.*;
import cz.muni.fi.pa165.entity.Car;
import cz.muni.fi.pa165.service.BeanMappingService;
import cz.muni.fi.pa165.service.CarService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.List;

@Service
@Transactional
public class CarFacadeImpl implements CarFacade {

    @Inject
    private CarService carService;

    @Inject
    private BeanMappingService beanMappingService;

    @Override
    public SimpleResult createCar(CarDTO car) {
        SimpleResult result = new SimpleResult();
        carService.createCar(beanMappingService.mapTo(car,Car.class));
        result.setIsSuccess(true);
        return result;
    }

    @Override
    public SimpleResult updateCar(CarDTO car) {
        SimpleResult result = new SimpleResult();
        carService.updateCar(beanMappingService.mapTo(car,Car.class));
        result.setIsSuccess(true);
        return result;
    }

    @Override
    public SimpleResult deleteCar(long id) {
        SimpleResult result = new SimpleResult();
        carService.deleteCar(id);
        result.setIsSuccess(true);
        return result;
    }

    @Override
    public List<CarDTO> findAllCars() {
        List<Car> cars = carService.findAllCar();
        return cars == null ? null : beanMappingService.mapTo(cars, CarDTO.class);
    }

}
