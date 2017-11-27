package cz.muni.fi.pa165.service;

import cz.muni.fi.pa165.entity.Car;
import cz.muni.fi.pa165.entity.RegionalBranch;
import cz.muni.fi.pa165.entity.User;
import cz.muni.fi.pa165.service.enums.RegionalBranchOperationErrorCode;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;


/**
 *
 * @author Martin Miskeje
 */
public interface RegionalBranchService {
	Set<RegionalBranchOperationErrorCode> create(RegionalBranch regionalBranch);
    
	Set<RegionalBranchOperationErrorCode> update(RegionalBranch regionalBranch);

	/**
	 * Delete regional branch. If branch contains children, for each children set new parent.
	 * @param id - id of branch
	 * @return deleted branch
	 */
    RegionalBranch delete(long id);
 
    /**
     * Find all branches
     * @return all branches 
     */
    List<RegionalBranch> findAll();

    /**
     * Find particular branch
     * @return particular branch
     */
    RegionalBranch findOne(long id);

    /**
     * Assign user to branch as employee, if user is already in another branch, reassign him
     */
    Set<RegionalBranchOperationErrorCode> assignUser(long regionalBranchId, User user);

    /**
     * Assign car to branch as employee, if car is already in another branch, reassign it
     */
    Set<RegionalBranchOperationErrorCode> assignCar(long regionalBranchId, Car car);
    
    /**
     * Find all available car for particular day in particular branch
     * @param regionalBranch
     * @param day
     * @return - all available car 
     */
    List<Car> findAllAvailableCarsForBranch(RegionalBranch regionalBranch, LocalDateTime day);
}
